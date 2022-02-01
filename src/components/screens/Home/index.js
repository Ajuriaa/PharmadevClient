import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, FlatList, ActivityIndicator, RefreshControl, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Input, Image, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import logo_vertical from '../../../assets/pharmadev.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { estilos } from './styles';
const { width, height } = Dimensions.get("screen");

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function HomeScreen({ navigation }) {
    const [usuario, setUsuario] = useState(null)
    const [nombre, setnombre] = useState(null)
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [offset, setOffset] = useState(1);
    const [isListEnd, setIsListEnd] = useState(false);
    const [search, setSearch] = useState("")
    const [refreshing, setRefreshing] = React.useState(false);
    const [filteredData, setFilteredData] = useState([])

    const getData = async () => {
        if (!loading) {
            setLoading(true);
            try {
                var jsonValue = await AsyncStorage.getItem('@usuario')
                jsonValue = JSON.parse(jsonValue)
                const response = await fetch('http://192.168.0.2:7777/api/producto/allP', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jsonValue.token,
                    },

                });
                const responseJson = await response.json();
                if (responseJson.data.length > 0) {
                    setDataSource([...responseJson.data]);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {

            }
        }
    };

    const ItemView = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => getItem(item)}>
                <View style={styles.producto}>
                    <View style={{ flex: 1 }}>
                        <Image
                            style={{ width: 110, height: 110, resizeMode: "contain" }}
                            source={{ uri: item.productoImagen }}
                        />
                    </View>
                    <View style={{ flex: 2, paddingLeft: 10 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }} >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#393E46" }}>{item.ProductoNombre}</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                        </View>
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: "#393E46" }} >L.{item.ProductoPrecio}</Text>
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

    const init = async () => {
        var jsonValue = await AsyncStorage.getItem('@usuario')
        jsonValue = JSON.parse(jsonValue)
        setnombre(jsonValue.usuarioNombre)
    }

    const getItem = (item) => {
        navigation.navigate('ProductScreen', { data: item })
    };

    const searchProducts = async (kword) => {
        let filteredDataS = dataSource.filter(function (item) {
            return item.ProductoNombre.toLowerCase().includes(kword.toLowerCase());
        });
        setFilteredData(filteredDataS)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        getData()
        wait(1000).then(() => setRefreshing(false));
    }, [])

    useEffect(() => {
        const reloadOnFocus = navigation.addListener('focus', () => {
            getData()
        });
        return reloadOnFocus;
    }, [navigation]);

    useEffect(() => { init() }, []);

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <View style={styles.encabezado}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.encabezadoTexto}>
                            <Text style={styles.titulo1} > Bienvenid@ {nombre} </Text>
                            <Text style={styles.titulo2}>Estos son los medicamentos disponibles</Text>
                            <Input
                                placeholder="🔎"
                                inputStyle={{ backgroundColor: 'white', borderRadius: 7, padding: 10 }}
                                value={search}
                                onChangeText={search => { setSearch(search); searchProducts(search) }}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.cuerpo}>
                    <View style={styles.cuerpo2}>
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        >
                            <FlatList
                                data={filteredData && filteredData.length > 0 ? filteredData : dataSource}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={ItemView}
                                ListFooterComponent={renderFooter}
                                initialNumToRender={6}
                            />
                        </RefreshControl>
                    </View>
                </View>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create(estilos);
