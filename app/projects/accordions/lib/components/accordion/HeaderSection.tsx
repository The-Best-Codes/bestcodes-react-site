import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface HeaderSectionProps {
  header: string;
  subheader: string;
  description: string;
  onHeaderChange: (value: string) => void;
  onSubheaderChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  header,
  subheader,
  description,
  onHeaderChange,
  onSubheaderChange,
  onDescriptionChange,
}) => (
  <Card className="mb-6 dark:border-slate-700 dark:bg-slate-800">
    <CardHeader>
      <CardTitle className="dark:text-white">Page Header</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="header" className="dark:text-white">
          Main Header
        </Label>
        <Input
          id="header"
          value={header}
          onChange={(e) => onHeaderChange(e.target.value)}
          className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subheader" className="dark:text-white">
          Subheader
        </Label>
        <Input
          id="subheader"
          value={subheader}
          onChange={(e) => onSubheaderChange(e.target.value)}
          className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="dark:text-white">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        />
      </div>
    </CardContent>
  </Card>
);
