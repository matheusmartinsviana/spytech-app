import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const StepSegment = ({ data, setData }: any) => (
    <div className="flex flex-col gap-2">
        <Label htmlFor="segment">Qual o segmento da sua empresa?</Label>
        <Input
            id="segment"
            name="segment"
            placeholder="Digite o segmento da empresa"
            value={data.segment}
            onChange={(e) => setData({ ...data, segment: e.target.value })}
        />
    </div>
)

export default StepSegment
