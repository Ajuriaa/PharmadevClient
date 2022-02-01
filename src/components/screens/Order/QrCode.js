import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SvgQRCode from 'react-native-qrcode-svg';
import logoApp from '../../../assets/pharmadevC.png'

const QrCode = (props) => {
    console.log(props.OrdenId);
    return (
        <SvgQRCode value={`${props.OrdenId}`} logo={logoApp} logoSize={50} logoBackgroundColor='#EEEEEE' size={300} color='#393E46'
        backgroundColor='#EEEEEE'/>
    )
}

export default QrCode

const styles = StyleSheet.create({})
