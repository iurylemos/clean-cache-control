import { SavePurchases } from "@/domain/usecases";
import { CacheStore } from "@/data/protocols/cache";

export class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    insertCallsCount = 0;
    deletekey: string;
    insertKey: string;
    insertValues: Array<SavePurchases.Params> = [];

    public delete(key: string): void {
        this.deleteCallsCount++;
        this.deletekey = key;
    }

    public insert(key: string, value: any): void {
        this.insertCallsCount++;
        this.insertKey = key;
        this.insertValues = value;
    }

    public simulateDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() });
    }

    public simulateInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error() });
    }
}