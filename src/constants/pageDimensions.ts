/* eslint-disable prettier/prettier */
import {Dimensions} from 'react-native';

enum PageDimensions {
    wp = Dimensions.get('window').width,
    hp = Dimensions.get('window').height,
}


export default PageDimensions;
