/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';
import DocumentDownload from '../DocumentDownload';
import { getResponsiveSize } from '../../../utilMethods';

interface ImageProps {
  base64String: string;
  type: string;
  closeModal?: any;
  modalVisible: boolean
}
function ImageViewer({ base64String, type, closeModal, modalVisible }: ImageProps) {
  return (
    <View>
      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.container}>
              <Image
                source={{
                  uri: `data:image/${type?.replace('.', '')};base64,${base64String}`,
                }}
                style={styles.image}
                resizeMode="contain"
              />
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
          </View>
        </View>
      </Modal>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});

export default ImageViewer;
