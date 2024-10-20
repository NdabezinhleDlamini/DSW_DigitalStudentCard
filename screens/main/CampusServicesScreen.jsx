import React, { useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
// Import ThemeContext to access dynamic theme colors
import { ThemeContext } from "@/contexts/ThemeContext";
import { Layout } from "@/constants/Layout";
import { Fonts } from "@/constants/Fonts";

export default function CampusServicesScreen({ navigation }) {
    const { currentColors } = useContext(ThemeContext); 

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: currentColors.background }, 
            ]}
        >
            <View style={styles.header}>
                <View style={styles.iconsContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                        <Ionicons
                            name="person-circle-outline"
                            size={24}
                            color={currentColors.text} 
                        />
                    </TouchableOpacity>
                    <View style={styles.notificationContainer}>
                        <TouchableOpacity style={{ paddingHorizontal: 15 }}>
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color={currentColors.text} 
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingHorizontal: 5 }}>
                            <Ionicons
                                name="settings-outline"
                                size={24}
                                color={currentColors.text} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TextInput
                style={[styles.input, { borderColor: currentColors.border }]} 
                placeholder="Search..."
                placeholderTextColor={currentColors.text} 
            />
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterSection}
            >
                <TouchableOpacity
                    style={[styles.filterChipActive, { backgroundColor: currentColors.tint }]} 
                >
                    <Text style={[styles.filterTextActive, { color: currentColors.background }]}>
                        General
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChipInactive, { backgroundColor: currentColors.primary }]} 
                >
                    <Text style={[styles.filterTextInactive, { color: currentColors.text }]}>
                        Card Management
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChipInactive, { backgroundColor: currentColors.primary }]} 
                >
                    <Text style={[styles.filterTextInactive, { color: currentColors.text }]}>
                        Support Services
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={[styles.mainSection, { backgroundColor: currentColors.card }]}>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Layout.padding,
        flex: 1,
    },
    header: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    iconsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: Layout.margin,
    },
    notificationContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        height: 40,
        width: "100%",
        marginBottom: Layout.margin / 2,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    filterSection: {
        height: 60,
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingVertical: Layout.padding / 2,
    },
    filterChipActive: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        paddingVertical: Layout.padding / 2,
        paddingHorizontal: Layout.padding,
        borderRadius: Layout.borderRadius,
    },
    filterChipInactive: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 1,
        paddingVertical: Layout.padding / 2,
        paddingHorizontal: Layout.padding,
        borderRadius: Layout.borderRadius,
    },
    filterTextActive: {
        ...Fonts.body,
    },
    filterTextInactive: {
        ...Fonts.body,
    },
    mainSection: {
        marginTop: Layout.margin,
    },
});
