/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getResponsiveSize } from '../../../utilMethods';
import { addItemIcon } from '../../../assets/icons';

function NavigatorFooterBar() {
    return (
        <View style={{ position: 'absolute', bottom: getResponsiveSize(0), height: getResponsiveSize(60), backgroundColor: '#C0392B', width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', display: 'flex', height: '100%' }}>
                <TouchableOpacity style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={addItemIcon} style={{ width: getResponsiveSize(20), height: getResponsiveSize(20) }} />
                    <Text style={{ color:'#D5DBDB',textAlign: 'center', fontWeight: 'bold', fontSize: getResponsiveSize(12) }}>Tüm Liste</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={addItemIcon} style={{ width: getResponsiveSize(20), height: getResponsiveSize(20) }} />
                    <Text style={{ color:'#D5DBDB',textAlign: 'center', fontWeight: 'bold', fontSize: getResponsiveSize(12) }}>Anasayfa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={addItemIcon} style={{ width: getResponsiveSize(20), height: getResponsiveSize(20) }} />
                    <Text style={{ color:'#D5DBDB',textAlign: 'center', fontWeight: 'bold', fontSize: getResponsiveSize(12) }}>Listem</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default NavigatorFooterBar;
