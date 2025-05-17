import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const StepCompany = ({ data, setData }: any) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor="company_name">Nome da Empresa</Label>
    <Input
      id="company_name"
      name="company_name"
      placeholder="Ex: MG Tech"
      value={data.company_name}
      onChange={(e) => setData({ ...data, company_name: e.target.value })}
      required
    />
  </div>
)

export default StepCompany
