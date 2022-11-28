import { MaterialIcons } from '@expo/vector-icons';
import {View, Text, Pressable} from 'react-native'

export default function CheckInDt(){
    return(
        <View style={styles.inputTextContainer}>
        <Text style={styles.label}>
          {label}:{mantory}
        </Text>
        <Pressable
          style={styles.pressable}
          onPress={() => {
            onOpen("bookingneeded");
          }}
        >
          {selected ? (
            <Text style={styles.text}>{selected.value}</Text>
          ) : (
            <Text style={styles.textHint}>{hint}</Text>
          )}
          <MaterialIcons name="arrow-drop-down" size={24} color="#A2A2A2" />
        </Pressable>
      </View>
    )
}