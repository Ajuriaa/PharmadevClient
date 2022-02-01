import React, { useEffect, useMemo, useReducer } from "react";
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LogBox } from 'react-native';
import LoginScreen from "../screens/Signin"
import ProfileScreen from "../screens/Profile"
import Signup from "../screens/Signup"
import HomeScreen from "../screens/Home"
import CartScreen from "../screens/Cart"
import ProductScreen from "../screens/Product"
import InformationScreen from '../screens/Information'
import RPasswordScreen from "../screens/RPassword";
import OrderScreen from "../screens/Order";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from "../providers/Context";
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProductScreen" component={ProductScreen}
                options={{
                    title: 'Producto',
                    headerStyle: {
                        backgroundColor: '#00ADB5',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="InformationScreen" component={InformationScreen}
                options={{
                    title: 'Información Personal',
                    headerStyle: {
                        backgroundColor: '#00ADB5',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Stack.Screen name="RPasswordScreen" component={RPasswordScreen}
                options={{
                    title: 'Cambio de Contraseña',
                    headerStyle: {
                        backgroundColor: '#00ADB5',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Stack.Navigator>
    );
}

function CartStack(){
    return (
        <Stack.Navigator>
            <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProductScreen" component={ProductScreen}
                options={{
                    title: 'Producto',
                    headerStyle: {
                        backgroundColor: '#00ADB5',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Stack.Screen name="OrderScreen" component={OrderScreen}
                options={{
                    title: 'Orden',
                    headerStyle: {
                        backgroundColor: '#00ADB5',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Stack.Navigator>
    );
}

const Navigation = () => {
    LogBox.ignoreAllLogs()

    const initialLoginState = {
        isLoading: true,
        userName: null,
        userToken: null
    }

    const loginReducer = (prevState, action) => {
        switch (action.type) {
            case 'RETRIEVE_TOKEN':
                return {
                    ...prevState,
                    userToken: action.token,
                    isLoading: false
                }
                break;
            case 'LOGIN':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false
                }
            case 'LOGOUT':
                return {
                    ...prevState,
                    userName: null,
                    userToken: null,
                    isLoading: false
                }
            case 'REGISTER':
                return {
                    ...prevState,
                    userName: action.id,
                    userToken: action.token,
                    isLoading: false
                }
            default:
                break;
        }
    }

    const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

    const authContext = useMemo(() => ({
        signIn: async (username, password) => {
            let token = null
            let usuarioNombre = null
            try {
                const response = await fetch('http://192.168.0.2:7777/api/autenticacion/login', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify({
                        usuario: username,
                        usuarioContrasena: password
                    })
                });
                const json = await response.json();
                if (json.data === "") {
                    return ({ error: "ERROR", msj: json.msj })
                } else {
                    await AsyncStorage.setItem('@usuario', JSON.stringify(json.data.usuario))
                    token = json.data.usuario.token
                    usuarioNombre = json.data.usuario.usuarioNombre
                }
            } catch (error) {
                console.error(error);
            }
            dispatch({ type: 'LOGIN', id: usuarioNombre, token: token })
        },
        signOut: async () => {
            await AsyncStorage.removeItem('@usuario')
            dispatch({ type: 'LOGOUT' })
        },
        signUp: async (identidad, nombre, telefono, email, contraseña) => {
            let token = null
            let usuarioNombre = null
            try {
                const response = await fetch('http://192.168.0.2:7777/api/usuario/newU', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Id: identidad,
                        usuarioNombre: nombre,
                        usuarioTelefono: telefono,
                        usuarioCorreo: email,
                        usuarioContrasena: contraseña
                    })
                });
                const json = await response.json();
                if (json.msj !== "Registro almacenado correctamente") {
                    if (json.msj === "Los datos ingresados no son validos") {
                        return ({ error: "ERROR", msj: json.data[0].msg })
                    }
                    return ({ error: "ERROR", msj: json.msj })
                } else {
                    try {
                        let cusuario = ""
                        if (telefono !== "") {
                            cusuario = telefono
                        } else if (telefono !== "") {
                            cusuario = email
                        }
                        const response2 = await fetch('http://192.168.0.2:7777/api/autenticacion/login', {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario: cusuario,
                                usuarioContrasena: contraseña
                            })
                        });
                        const json2 = await response2.json();
                        if (json2.data === "") {
                            return ({ error: "ERROR", msj: json.msj })
                        } else {
                            await AsyncStorage.setItem('@usuario', JSON.stringify(json2.data.usuario))
                            token = json2.data.usuario.token
                            usuarioNombre = json2.data.usuario.usuarioNombre
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            } catch (error) {
                console.error(error);
            }
            dispatch({ type: 'REGISTER', id: usuarioNombre, token: token })
        }
    }), [])

    useEffect(() => {
        setTimeout(async () => {
            let userToken = null
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                userToken = jsonValue.token
            } catch (error) {
                console.log(error);
            }
            dispatch({ type: 'REGISTER', token: userToken })
        }, 1000)
    }, []);

    // SplashScreen.preventAutoHideAsync();

    if (loginState.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", flexDirection: "row", justifyContent: "space-around", padding: 10 }}>
                <ActivityIndicator size="large" color="#00ADB5" />
            </View>
        )
    }

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {loginState.userToken !== null ? (
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                let iconName;
                                if (route.name === 'HomeStack') {
                                    iconName = focused ? 'home' : 'home-outline';
                                } else if (route.name === 'ProfileStack') {
                                    iconName = focused ? 'person' : 'person-outline';
                                } else if (route.name === 'CartStack') {
                                    iconName = focused ? 'cart' : 'cart-outline';
                                }
                                return <Ionicons name={iconName} size={size} color={color} />;
                            },
                            tabBarActiveTintColor: 'white',
                            tabBarInactiveTintColor: '#393E46',
                            tabBarShowLabel: false,
                            headerShown: false,
                            tabBarStyle: { backgroundColor: "#00ADB5" }
                        })}
                    >
                        <Tab.Screen name="HomeStack" component={HomeStack} />
                        <Tab.Screen name="CartStack" component={CartStack} />
                        <Tab.Screen name="ProfileStack" component={ProfileStack} />
                    </Tab.Navigator>
                ) : (
                    <Stack.Navigator initialRouteName='LoginScreen'>
                        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Signup" component={Signup}
                            options={{
                                title: 'Registro',
                                headerStyle: {
                                    backgroundColor: '#00ADB5',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    </Stack.Navigator>
                )}

            </NavigationContainer>
        </AuthContext.Provider>
    );
}

export default Navigation