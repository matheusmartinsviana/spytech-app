import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const StepDescription = ({ data, setData }: any) => (
    <div className="flex flex-col gap-2">
        <Label htmlFor="description">Diga mais sobre sua empresa</Label>
        <Textarea
            id="description"
            name="description"
            placeholder="Descreva brevemente sua empresa"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            required
        />
    </div>
)

export default StepDescription
