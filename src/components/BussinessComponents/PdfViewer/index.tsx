/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import DocumentDownload from '../DocumentDownload';
import { getResponsiveSize } from '../../../utilMethods';

interface ImageProps {
    base64String: string;
    type: string;
    closeModal?: any;
    modalVisible: boolean
}

function PdfViewer({ base64String, modalVisible, closeModal,type }: ImageProps) {
    const source = { uri: 'data:application/pdf;base64,' + base64String };
    return (
        <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
            <View style={styles.modalBackground}>
                <Pdf
                    source={source}
                    style={styles.pdf} />
                <View style={{ flexDirection: 'row', display: 'flex' }}>
                    <DocumentDownload base64String={base64String} type={type} />
                    <TouchableOpacity onPress={closeModal} style={{
                        backgroundColor: '#E74C3C',
                        height: getResponsiveSize(30),
                        width: '33%',
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontWeight: 'bold', color: '#f0f0f0' }}>Kapat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
}

const styles = StyleSheet.create({
    image: {
        width: 500,
        height: 300,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Arka planı karartmak için
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#082567',
        padding: 0,
        borderRadius: 10,
        alignItems: 'center',

    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        width: Dimensions.get('window').width * 0.95,
        height: Dimensions.get('window').height * 0.8,
        borderRadius:getResponsiveSize(10),
    },
});


export default PdfViewer;
