/* ---> import libraries <--- */
import React from 'react';
import {View, Text} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/AntDesign';

import styles from './Dropdown.styles';

const DROPDOWN_CONSTANTS = {
  ITEM_HEIGHT: 42,
  MAX_DROPDOWN_HEIGHT: 400,
  COMPETITOR_SITE_ITEM_HEIGHT: 64,
};

// const showLabel = props => {
//   const {topContainerStyle = {}, label = ''} = props;
//   return (
//     <View
//       style={[styles.topContainer, topContainerStyle]}
//       <Text style={[styles.labelText]}>{label}</Text>
//     </View>
//   );
// };

const renderDropdown = props => {
  const {
    data = [],
    dropDownHeaderText = '',
    selectedItem = '',
    label = '',
    dropDownListStyle = {},
    dropDownItemContainer = {},
    dropdownStyle = {},
    dropDownSelectedText = {},
    iconWrapperRight = {},
    selectItemHandle,
    brand = '',
    street = '',
    dropDownTestId = '',
  } = props;

  const {ITEM_HEIGHT, MAX_DROPDOWN_HEIGHT} = DROPDOWN_CONSTANTS;

  return (
    <ModalDropdown
      options={data}
      dropdownStyle={[
        styles.dropDownListStyle,
        {
          height:
            data.length * ITEM_HEIGHT < MAX_DROPDOWN_HEIGHT
              ? data.length * ITEM_HEIGHT
              : MAX_DROPDOWN_HEIGHT,
        },
        dropDownListStyle,
      ]}
      // renderRowProps={styles.selectedItemHighlightStyle}
      renderSeparator={() => <View />}
      renderRow={(option, index) => (
        <View style={[styles.dropDownItemContainer, dropDownItemContainer]}>
          <Text style={styles.dropDownItemText}>{option[label]}</Text>
          {brand && street ? (
            <Text style={styles.dropDownItemText}>{`${option[brand]}, ${
              option[street]
            } `}</Text>
          ) : null}
        </View>
      )}
      onSelect={selectItemHandle}>
      <View style={styles.fieldContainer}>
        <View style={[styles.dropdownStyle, dropdownStyle]}>
          <View>
            <Text
              numberOfLines={2}
              style={[styles.dropDownSelectedText, dropDownSelectedText]}>
              {selectedItem ? selectedItem : dropDownHeaderText}
            </Text>
          </View>

          <View style={[styles.iconWrapperRight, iconWrapperRight]}>
            <Icon name="down" size={24} color={'grey'} />
          </View>
        </View>
      </View>
    </ModalDropdown>
  );
};

export const DropdownComponent = props => {
  return (
    <View
      style={[styles.container, props.containerStyle]}
      testID={props.testID}>
      {/* {props.showLabel ? showLabel(props) : null} */}
      {renderDropdown(props)}
    </View>
  );
};
