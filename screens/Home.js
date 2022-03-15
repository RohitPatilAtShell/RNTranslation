import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {useSafeArea} from 'react-native-safe-area-context';
import {Tile} from '../components/Tile';
import { Translate, withTranslation } from '@sede-x/translation';

type Props = {
  t: Translate;
  };

export const Home = () => {
  const [total, changeTotal] = useState(0);
  const insets = useSafeArea();

  const fruits = [
    {
      name: Translate['fruit.apple'],
      price:
        Translate['app.currency'] + Translate['fruit.apple.price.value'],
      pic: require('../assets/apple.png'),
    },
    {
      name: Translate['fruit.banana'],
      price:
      Translate['app.currency'] + Translate['fruit.banana.price.value'],
      pic: require('../assets/banana.png'),
    },
    {
      name: Translate['fruit.watermelon'],
      price:
      Translate['app.currency'] +
      Translate['fruit.watermelon.price.value'],
      pic: require('../assets/watermelon.png'),
    },
  ];

  const addToTotal = price => {
    changeTotal(total + price);
  };

  const removeFromTotal = price => {
    changeTotal(total - price);
  };

  return (
    <ScrollView>
      <View
        style={[
          styles.container,
          {paddingTop: insets.top, paddingBottom: insets.bottom},
        ]}>
        <Text h1 h1Style={styles.grocery}>
          {Translate['shop.title']}
        </Text>
        <Text style={styles.date}>
          {Translate['date.title']}: {Translate['date.format']}
        </Text>
        {fruits.map(fruit => {
          return (
            <React.Fragment key={fruit.name}>
              <Tile
                fruit={fruit}
                addToTotal={addToTotal}
                removeFromTotal={removeFromTotal}
              />
            </React.Fragment>
          );
        })}
        <Text h3 h3Style={styles.total}>
          {Translate['cart.total.title']}:
          {Translate.formatString(
            Translate['cart.total.value.currencyStart'],
            {
              currencyStart: Translate['app.currency'],
              value: total,
            },
          )}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  grocery: {
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
  },
  total: {
    marginTop: 30,
    textAlign: 'center',
    color: 'red',
  },
});
