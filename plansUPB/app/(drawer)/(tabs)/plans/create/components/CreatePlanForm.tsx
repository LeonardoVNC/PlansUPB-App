import { Icon, Input, Layout, Button } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { Plan } from "../../../../../../src/interfaces/plans.interfaces";
import { useUserStore } from "../../../../../../src/store/useUserStore";

function CreatePlanForm({ onSubmit }: { onSubmit: (values: Omit<Plan, 'id'>) => void }) {
    const { user } = useUserStore();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isValidInfo, setIsValidInfo] = useState(false)
    //TODO fecha y hora

    useEffect(() => {
        setIsValidInfo(title.trim().length > 0 && description.trim().length > 0)
    }, [title, description])

    const handleSubmit = () => {
        if (!isValidInfo || !user) {
            return
        }
        const values: Omit<Plan, 'id'> = {
            title: title.trim(),
            description: description.trim(),
            date: new Date, //TODO fecha y hora x2
            owner: user?.code,
            done: false
        }
        onSubmit(values)
    }

    return (
        <Layout style={{ flex: 1, gap: 16 }}>
            <Input
                label="Titulo"
                placeholder="Ej: Salir al cine"
                value={title}
                onChangeText={setTitle}
                style={{ marginBottom: 8 }}
                status={title ? 'success' : 'basic'}
                accessoryLeft={<Icon name="edit-2-outline" pack="eva" />}
            />

            <Input
                label="Descripción"
                placeholder="Detalles extra del plan..."
                value={description}
                onChangeText={setDescription}
                style={{ marginBottom: 8 }}
                accessoryLeft={<Icon name="message-square-outline" pack="eva" />}
                multiline
                numberOfLines={4}
                textStyle={{ minHeight: 80, lineHeight: 20 }}
            />

            <Button
                onPress={handleSubmit}
                status="primary"
                disabled={!isValidInfo}
                style={{ marginTop: 8 }}
                accessoryLeft={<Icon name="plus-outline" pack="eva" />}
            >
                Crear Plan
            </Button>
        </Layout>
    );
}

export default CreatePlanForm;