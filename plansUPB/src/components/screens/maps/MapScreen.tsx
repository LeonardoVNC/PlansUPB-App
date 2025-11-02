import { useState, useEffect } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Select, SelectItem, IndexPath, Icon } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import MapActionsModal from "./MapActionsModal";
import { categories } from "data/categories";

function MapScreen({ plans }: { plans: Plan[] }) {
    const { colors } = useThemeColors();
    const [filteredPlans, setFilteredPlans] = useState<Plan[]>(plans);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isActionsVisible, setIsActionsVisible] = useState(false);

    useEffect(() => {
        if (selectedCategories.length === 0) {
            setFilteredPlans(plans);
        } else {
            setFilteredPlans(plans.filter(plan => selectedCategories.includes(plan.category)));
        }
    }, [plans, selectedCategories]);

    const handleMarker = (plan: Plan) => {
        setSelectedPlan(plan);
        setIsActionsVisible(true);
    };

    const handleCloseActions = () => {
        setSelectedPlan(null);
        setIsActionsVisible(false);
    };

    const handleCategorySelect = (index: IndexPath | IndexPath[]) => {
        const indices = Array.isArray(index) ? index : [index];
        const selected = indices
            .map(i => categories[i.row])
            .filter(Boolean);
        setSelectedCategories(selected);
    };

    const selectedIndex = selectedCategories
        .map(cat => categories.findIndex(c => c === cat))
        .filter(i => i >= 0)
        .map(i => new IndexPath(i));

    return (
        <>
            <View style={{
                position: 'absolute',
                top: 10,
                left: 10,
                right: 10,
                zIndex: 1,
                backgroundColor: colors.surface,
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
            }}>
                <Select
                    placeholder="Filtrar por categoría"
                    value={selectedCategories.length > 0 ? `${selectedCategories.length} seleccionadas` : 'Todas'}
                    multiSelect
                    selectedIndex={selectedIndex.length > 0 ? selectedIndex : undefined}
                    onSelect={handleCategorySelect}
                    accessoryLeft={<Icon name="funnel-outline" />}
                    style={{ marginBottom: 8 }}
                >
                    {categories.map((category, index) => (
                        <SelectItem key={index} title={category} />
                    ))}
                </Select>
            </View>

            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: plans[0]?.place?.lat || 0,
                    longitude: plans[0]?.place?.lng || 0,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {filteredPlans.map(plan => (
                    plan.place && (
                        <Marker
                            key={plan.id}
                            coordinate={{
                                latitude: plan.place.lat,
                                longitude: plan.place.lng,
                            }}
                            title={plan.title}
                            description={plan.place.name}
                            onPress={() => { handleMarker(plan) }}
                        />
                    )
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