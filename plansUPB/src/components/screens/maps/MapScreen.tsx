import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Plan } from "@interfaces/plans.interfaces";
import MapActionsModal from "./MapActionsModal";

function MapScreen({ plans }: { plans: Plan[] }) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [isActionsVisible, setIsActionsVisible] = useState(false)

    const handleMarker = (plan: Plan) => {
        setSelectedPlan(plan)
        setIsActionsVisible(true)
    }

    const handleCloseActions = () => {
        setSelectedPlan(null)
        setIsActionsVisible(false)
    }

    return (
        <>
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: plans[0].place!.lat,
                    longitude: plans[0].place!.lng,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {plans.map(plan => (
                    <Marker
                        key={plan.id}
                        coordinate={{
                            latitude: plan.place!.lat,
                            longitude: plan.place!.lng,
                        }}
                        title={plan.title}
                        description={plan.place!.name}
                        onPress={() => { handleMarker(plan) }}
                    />
                ))}
            </MapView>

            {selectedPlan && (
                <MapActionsModal
                    plan={selectedPlan}
                    visible={isActionsVisible}
                    onClose={handleCloseActions}
                />
            )}
        </>
    );
}

export default MapScreen;