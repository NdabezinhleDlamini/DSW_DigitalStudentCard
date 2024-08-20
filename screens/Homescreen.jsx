import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Homescreen({navigation}) {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <StatusBar translucent backgroundColor={"rgba(0,0,0,0)"} />
                <Text>Home</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <View style={styles.btn}>
                    <Text>Log In</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#4CAF50",
        margin:50,
        height:60,
        width:120,
    }
});
