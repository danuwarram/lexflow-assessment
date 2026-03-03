import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Shareholder {
    id: bigint;
    nationality: string;
    lastName: string;
    companyId: bigint;
    firstName: string;
}
export interface ShareholderInput {
    nationality: string;
    lastName: string;
    firstName: string;
}
export interface Company {
    id: bigint;
    status: CompanyStatus;
    name: string;
    totalCapital: number;
    numShareholders: bigint;
}
export interface CompanyWithShareholders {
    company: Company;
    shareholders: Array<Shareholder>;
}
export enum CompanyStatus {
    complete = "complete",
    draft = "draft"
}
export interface backendInterface {
    createCompany(name: string, numShareholders: bigint, totalCapital: number): Promise<bigint>;
    deleteCompany(id: bigint): Promise<void>;
    getCompanies(): Promise<Array<CompanyWithShareholders>>;
    getCompany(id: bigint): Promise<CompanyWithShareholders | null>;
    updateCompanyShareholders(companyId: bigint, shareholdersInput: Array<ShareholderInput>): Promise<void>;
}
