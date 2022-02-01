import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Button, TextInput, Dimensions, ScrollView, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Input, CheckBox, Image, Text, SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import logo_vertical from '../../../assets/pharmadev.png';
import QrCode from './QrCode';
const { width, height } = Dimensions.get("screen");


export default function OrderScreen({ route,navigation }) {
    const [search, setSearch] = useState("")
    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <View style={styles.encabezado}>
                    <View style={styles.encabezadoTexto}>
                        <Text style={styles.titulo1}>Número de Orden: #{route.params.OrdenId}</Text>
                    </View>
                </View>
                <View style={styles.cuerpo}>
                    <View style={styles.cuerpo2}>
                        <View style={{flex: 1, flexDirection:'column'}}>
                            <View style={{flex:5,justifyContent:'center',alignItems:'center'}}>
                                <QrCode OrdenId={route.params.OrdenId}/>
                            </View>
                            <View style={{flex:1,alignItems:"center",marginTop:20 }}>
                                <Text style={{alignSelf: "center",fontSize:16,fontWeight:"bold",color:'#393E46'}}>Gracias por realizar su reserva.</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaProvider>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE'
    },
    encabezado: {
        flex: 1,
        backgroundColor: "#00ADB5",
        padding: 20
    },
    cuerpo: {
        flex: 12
    },
    pie: {
        flex: 1,
        backgroundColor: "#00ADB5",
        padding: 20
    },
    titulo1: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginTop: 20
    },
    titulo2: {
        fontSize: 14,
        color: "#393E46"
    },
    empty: {
        flex: 1
    },
    encabezadoTexto: {
        flex: 1,
        alignItems: "center"
    },
    buscar: {
        flex: 2,
        backgroundColor: "white",
        borderRadius: 7
    },
    cuerpo2: {
        flex: 1,
        flexDirection: "column",
        padding: 20
    },
    pie2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center"
    }
});
