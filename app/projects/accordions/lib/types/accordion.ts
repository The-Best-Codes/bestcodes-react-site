export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface Project {
  id: string;
  name: string;
  header: string;
  subheader: string;
  description: string;
  items: AccordionItem[];
}
