/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import ImageViewer from '../ImageViewer';
import PdfViewer from '../PdfViewer';

interface ImageProps {
    base64String: string;
    kind: string;
    type: string;
    closeModal?: any;
    modalVisible: boolean
}
function DocumentViewer({ base64String, kind, type, closeModal, modalVisible }: ImageProps) {
    useEffect(()=>{
        console.log('kind',kind);
    },[]);
    if (kind === 'image') {
        return (
            <ImageViewer
                modalVisible={modalVisible}
                base64String={base64String}
                type={type}
                closeModal={closeModal} />
        );
    }
    else if (kind === 'pdf') {
        return (
            <PdfViewer
                modalVisible={modalVisible}
                base64String={base64String}
                type={type}
                kind={kind}
                closeModal={closeModal} />
        );
    }
}

export default DocumentViewer;
