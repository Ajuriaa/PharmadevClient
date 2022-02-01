import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Input, Image, Text } from "react-native-elements";
import Icons from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get("screen");
import AwesomeAlert from 'react-native-awesome-alerts';
import { estilos } from './styles';

export default function CartScreen({ navigation }) {
    const [search, setSearch] = useState("")
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subtotal, setSubtotal] = useState(0)
    const [impuesto, setImpuesto] = useState(0)
    const [total, setTotal] = useState(0)
    const [filteredData, setFilteredData] = useState([])
    const [alert, setAlert] = useState(false)
    const [mensaje, setMensaje] = useState(null)

    const getData = async () => {
        if (!loading) {
            setLoading(true);
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                const response = await fetch('http://192.168.0.2:7777/api/carritoproducto/allP', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },
                    body: JSON.stringify({
                        CarritoId: jsonValue.carritoId[0].id,
                    })

                });
                const responseJson = await response.json();
                let data = 0
                if (responseJson.msj == "Peticion procesada correctamente") {
                    setDataSource([...responseJson.data])
                    data = [...responseJson.data]
                }
                let z = 0, desc = 0
                data.forEach(element => {
                    z += element.CarritoProductoCantidad * element.Producto.ProductoPrecio

                })
                z = (Number(z))
                let isv = z * 0.15
                setImpuesto(isv)
                setSubtotal(z)
                setTotal((z + isv))
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <TouchableOpacity style={styles.producto} onPress={() => getItem(item)}>
                <View style={{ flex: 1 }}>
                    <Image
                        style={styles.imagen}
                        source={{ uri: item.Producto.productoImagen }}
                    />
                </View>
                <View style={{ flex: 2 }}>
                    <View style={styles.row} >
                        <View style={{ flex: 6 }}>
                            <Text style={styles.txtnombreproducto}>{item.Producto.ProductoNombre}</Text>
                        </View>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={() => deleteP(item.Producto.id)}>
                            <Icons size={20} name="trash" color="red" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }} >
                        <Text style={styles.txtprecio} >L.{item.Producto.ProductoPrecio}</Text>
                    </View>
                    <View style={styles.row} >
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1 }}>
                            <View style={styles.txtContador}>
                                <Text style={styles.txtContadorTexto}>{item.CarritoProductoCantidad}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        return (
            // Footer View with Loader
            <View style={styles.footer}>
                {loading ? (
                    <ActivityIndicator
                        color="black"
                        style={{ margin: 15 }} />
                ) : null}
            </View>
        );
    };

    const deleteP = async (idP) => {
        if (!loading) {
            setLoading(true);
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                const response = await fetch('http://192.168.0.2:7777/api/carritoproducto/delP', {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },
                    body: JSON.stringify({
                        CarritoId: jsonValue.carritoId[0].id,
                        ProductoId: idP
                    })

                });
                const responseJson = await response.json();
                if (responseJson.msj == "El registro ha sido eliminado") {
                    getData()
                } else {
                    console.log(responseJson.msj)
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const getItem = (item) => {
        navigation.navigate('ProductScreen', { data: item.Producto })
    };

    const handleOrder = async _ => {
        var jsonValue = await AsyncStorage.getItem('@usuario')
        jsonValue = JSON.parse(jsonValue)
        if (dataSource.length > 0) {
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                const response = await fetch('http://192.168.0.2:7777/api/orden/newO', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },
                    body: JSON.stringify({
                        productos: dataSource,
                        Id: jsonValue.Id,
                        OrdenSubtotal: subtotal,
                        OrdenDescuento: 0,
                        OrdenImpuesto: impuesto,
                        OrdenTotal: total,
                    })
                });
                const responseJson = await response.json();
                jsonValue.carritoId[0].id = responseJson.data.id
                await AsyncStorage.setItem('@usuario', JSON.stringify(jsonValue))
                navigation.navigate('OrderScreen', { OrdenId: responseJson.data.OrdenId })
                console.log(responseJson);
            } catch (error) {
                console.log(error);
            }
        } else {

        }
    }

    const searchProducts = async (kword) => {
        let filteredDataS = dataSource.filter(function (item) {
            return item.Producto.ProductoNombre.toLowerCase().includes(kword.toLowerCase());
        });
        setFilteredData(filteredDataS)
    }

    useEffect(() => {
        const reloadOnFocus = navigation.addListener('focus', () => {
            getData()
        });
        return reloadOnFocus;
    }, [navigation]);

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <View style={styles.encabezado}>
                    <View style={styles.encabezadoTexto}>
                        <Text style={styles.titulo1}>Detalle de su reserva</Text>
                        <Input
                            value={search}
                            onChangeText={search => { setSearch(search); searchProducts(search) }}
                            placeholder="🔎"
                            inputStyle={{ backgroundColor: 'white', borderRadius: 7, padding: 10 }}
                        />
                    </View>
                </View>
                <View style={styles.cuerpo}>
                    <View style={styles.cuerpo2}>
                        {dataSource.length >= 1 ? (
                            <FlatList
                                data={filteredData && filteredData.length > 0 ? filteredData : dataSource}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={ItemView}
                                ListFooterComponent={renderFooter}
                            />
                        ) : (
                            <View style={styles.cartEmpty}>
                                <Icons
                                    size={90} color="#393E46"
                                    name='shopping-cart'
                                />
                                <Text style={{ marginTop: 20, fontSize: 20 }}>Tu carrito está vacío</Text>
                            </View>
                        )}
                    </View>
                </View>
                {dataSource.length >= 1 && (
                    <View style={styles.pie}>
                        <View style={styles.row}>
                            <View style={{ flex: 1, flexDirection: "column", }}>
                                <Text>Subtotal: L.{subtotal}</Text>
                                <Text>ISV: L.{impuesto}</Text>
                                <Text>Descuento: L.0.00</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: "column", }}>
                                <Text>Total: L.{total}</Text>
                                <TouchableOpacity style={styles.appButtonContainer} onPress={handleOrder}>
                                    <Text style={styles.appButtonText}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
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
