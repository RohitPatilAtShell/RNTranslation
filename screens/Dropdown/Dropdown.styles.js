import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  topContainer: {
    marginBottom: 4,
  },
  labelText: {
    fontSize: 14,
    color: 'black',
  },
  fieldContainer: {
    marginVertical: 2,
  },
  dropDownListStyle: {
    borderWidth: 1,
    borderColor: 'grey',
  },
  iconWrapperRight: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  iconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  dropdownStyle: {
    flexDirection: 'row',
    borderColor: 'grey',
    borderWidth: 1,
    justifyContent: 'space-between',
    height: 32,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dropDownItemContainer: {
    width: width * 0.9,
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 5,
  },
  dropDownItemText: {
    fontSize: 13,
    color: 'black',
  },
  dropDownSelectedText: {
    fontSize: 13,
    width: width * 0.8,
    color: 'black',
  },
});

export default styles;
