export interface TemplateParams {
    level: string | null | undefined;
    message: string | null | undefined;
    date: string | null | undefined;
}

export class TemplateResolver {
    static resolveTempalate(text: string, params: TemplateParams) {
        return text
            .replaceAll("{level}", params.level || "")
            .replaceAll("{message}", params.message || "")
            .replaceAll("{date}", params.date || "");
    }
}
