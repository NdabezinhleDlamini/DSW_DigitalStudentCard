import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";

export function useNfc() {
    const [isNfcSupported, setIsNfcSupported] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const checkNfcStatus = useCallback(async () => {
        const deviceIsSupported = await NfcManager.isSupported();
        const notEnabled = await NfcManager.isEnabled();
        console.log(notEnabled, deviceIsSupported);
        setIsNfcSupported(deviceIsSupported);
        if (deviceIsSupported) {
            console.log("NFC is supported");
            initNfc();
        }
        if (!notEnabled) {
            NfcManager.goToNfcSetting();
        }
    }, []);

    useEffect(() => {
        checkNfcStatus(); // Initialize NFC manager when component mounts
        return () => {
            cleanUp(); // Clean up when component unmounts
        };
    }, [checkNfcStatus]);

    const initNfc = async () => {
        try {
            await NfcManager.start(); // Start NFC manager
            console.log("NFC manager started");
        } catch (ex) {
            console.warn("NFC initialization error", ex);
        }
    };

    const cleanUp = async () => {
        NfcManager.cancelTechnologyRequest();
    };

    const invalidateSession = async (isError = false, error = "") => {
        if (isError === false) {
            NfcManager.invalidateSessionIOS();
        } else {
            NfcManager.invalidateSessionWithErrorIOS(error);
        }
    };

    const readTag = async ({ writeMessageForOS } = {}) => {
        setIsScanning(true);
        console.log("read tag function, 1");
        try {
            console.log("read tag function, 2");
            await NfcManager.requestTechnology(NfcTech.Ndef, {
                alertMessage: writeMessageForOS,
            });
            console.log("read tag function, 3");
            const tag = await NfcManager.getTag();
            console.log("read tag function, 4");
            if (tag !== null && tag.ndefMessage && tag.ndefMessage.length > 0) {
                console.log("read tag function, 5", tag);
                return tag;
            } else {
                console.log("read tag function, 6");
                throw new Error("No NDEF message found on the tag");
            }
        } catch (error) {
            console.log("read tag function, 7", error);
            throw new Error("NFC Read operation error: " + error);
        } finally {
            console.log("read tag function, 8r");
            setIsScanning(false);
        }
    };

    const decodeMessage = (data) => {
        return Ndef.text.decodePayload(data);
    };

    const writeToTag = async ({ dataToWrite, writeMessageForOS } = {}) => {
        setIsScanning(true);
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef, {
                alertMessage: writeMessageForOS || "Ready to write NFC tag!",
            });
            if (Platform.OS === "ios") {
                setTimeout(() => {
                    NfcManager.setAlertMessageIOS("Please hold your device steady...");
                }, 400);
            }

            const bytesToWrite = Ndef.encodeMessage([Ndef.textRecord(dataToWrite)]);
            await NfcManager.ndefHandler.writeNdefMessage(bytesToWrite);
            return true;
        } catch (error) {
            throw new Error("NFC write operation error: " + error);
        } finally {
            setIsScanning(false);
        }
    };

    return {
        isNfcSupported,
        isScanning,
        readTag,
        writeToTag,
        cleanUp,
        decodeMessage,
        invalidateSession,
    };
}
