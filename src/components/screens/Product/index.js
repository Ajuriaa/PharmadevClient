import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image, Text } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get("screen");
import { Icon } from 'react-native-elements'
import { estilos } from './styles';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function ProductScreen({ route, navigation }) {
    const [cantidad, setCantidad] = useState(1)
    const [existencia, setExistencia] = useState(route.params.data.Inventarios.InventarioExistencia)
    const [alert, setAlert] = useState(false)
    const [mensaje, setMensaje] = useState(null)


    const addCntity = () => {
        let temp = cantidad
        temp += 1
        temp >= 1 ? setCantidad(temp) : setCantidad(cantidad)
        temp > existencia ? setCantidad(cantidad) : setCantidad(temp)
    }

    const restCntity = () => {
        let temp = cantidad
        temp -= 1
        temp >= 1 ? setCantidad(temp) : setCantidad(cantidad)
    }

    const addToCart = async () => {
        try {
            var jsonValue = await AsyncStorage.getItem('@usuario')
            jsonValue = JSON.parse(jsonValue)
            const response = await fetch('http://192.168.0.2:7777/api/carritoproducto/addCP', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jsonValue.token,
                },
                body: JSON.stringify({
                    CarritoId: jsonValue.carritoId[0].id,
                    ProductoId: route.params.data.id,
                    CarritoProductoCantidad: cantidad
                })
            });
            const responseJson = await response.json();
            if (responseJson.msj === "Registro almacenado correctamente") {
                navigation.goBack()
                setCantidad(1)
                // setMensaje("Se agregó el producto al carrito con éxito")
                // setAlert(!alert)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                {<View style={{ padding: 10 }}>
                </View>}
                <View style={styles.cuerpo}>
                    <View style={styles.cuerpo2}>
                        <Image
                            containerStyle={{ borderRadius: 7, backgroundColor: "white" }}
                            resizeMode={"cover"}
                            style={{ width: width - 40, height: 250, resizeMode: "contain" }}
                            source={{ uri: route.params.data.productoImagen }}
                        />
                        <Text style={{ fontSize: 16, color: "#393E46", textAlign: 'justify', marginTop: 10 }}>{route.params.data.ProductoDescripcion}</Text>
                        <Text style={{ fontSize: 16, color: "#393E46", fontWeight: 'bold', marginTop: 10 }}>Laboratorio: {route.params.data.Laboratorio.LaboratorioNombre}</Text>
                    </View>
                </View>
                <View style={{ flex: 2 }}>
                    <View style={styles.cuerpo2}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 22, color: "#393E46", fontWeight: 'bold' }}>{route.params.data.ProductoNombre} {route.params.data.Presentacion.PresentacionNombre}  L. {route.params.data.ProductoPrecio}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} >
                                <TouchableOpacity>
                                    <Icon
                                        containerStyle={styles.iconos}
                                        name='plus'
                                        type='font-awesome'
                                        color='#00ADB5'
                                        onPress={() => addCntity()} />
                                </TouchableOpacity>
                                <View style={styles.txtContador}>
                                    <Text style={styles.txtContadorTexto}>{cantidad}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Icon
                                        containerStyle={styles.iconos}
                                        name='minus'
                                        type='font-awesome'
                                        color='#00ADB5'
                                        onPress={() => restCntity()} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                <TouchableOpacity style={styles.btnCerrar} onPress={() => addToCart()} >
                                    <Text style={styles.txtCerrar}>Agregar al carrito</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <AwesomeAlert
                    show={alert}
                    showProgress={true}
                    title="PharmaDev"
                    message={mensaje}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    showCancelButton={false}
                    showConfirmButton={true}
                    cancelText="COMPRENDO"
                    confirmText="COMPRENDO"
                    confirmButtonColor="#00ADB5"
                    onCancelPressed={() => {
                        setAlert(!alert)
                    }}
                    onConfirmPressed={() => {
                        setAlert(!alert)
                    }}
                />
            </View>
        </SafeAreaProvider>
    );
}



const styles = StyleSheet.create(estilos);
