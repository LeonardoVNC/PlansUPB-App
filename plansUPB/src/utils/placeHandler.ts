import { Linking } from "react-native";

export const openMapsApp = async (name: string, lat: number, lng: number) => {
    const geoUrl = `geo:${lat},${lng}?q=${encodeURIComponent(`${lat},${lng} (${name})`)}`
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

    const canOpenGeo = await Linking.canOpenURL(geoUrl);
    if (canOpenGeo) {
        await Linking.openURL(geoUrl);
        return
    }
    const canOpenWeb = await Linking.canOpenURL(webUrl);
    if (canOpenWeb) {
        await Linking.openURL(webUrl);
        return
    }
}