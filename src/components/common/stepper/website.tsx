import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const StepWebsite = ({ data, setData }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setData({ ...data, website: value })
    }

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor="website">Sua empresa possui website?</Label>
            <p className="text-sm text-muted-foreground">
                Caso não tenha, insira o link de alguma rede social.
            </p>
            <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://suaempresa.com"
                value={data.website}
                onChange={handleChange}
            />
        </div>
    )
}

export default StepWebsite
