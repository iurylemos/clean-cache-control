import { CacheStore } from '@/data/protocols/cache';
import { mockPurchases } from '@/data/tests';
import { LocalSavePurchases } from '@/data/usecases';
import { SavePurchases } from '@/domain/usecases';

//sut = system under test

class CacheStoreSpy implements CacheStore {
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

type SutTypes = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore);
    return {
        sut,
        cacheStore
    }
}

describe('LocalSavePurchases', () => {
    test('Should not delete cache on sut.init', () => {
        const { cacheStore } = makeSut();
        expect(cacheStore.deleteCallsCount).toBe(0);
    })

    test('Should delete old cache on sut.save', async () => {
        const { cacheStore, sut } = makeSut();
        await sut.save(mockPurchases());
        expect(cacheStore.deletekey).toBe('purchases');
        expect(cacheStore.deleteCallsCount).toBe(1);
    })

    test('Should not insert new Cache if delete fails', () => {
        const { cacheStore, sut } = makeSut();
        cacheStore.simulateDeleteError();
        const promise = sut.save(mockPurchases());
        expect(cacheStore.insertCallsCount).toBe(0);
        expect(promise).rejects.toThrow()
    })

    test('Should insert new Cache if delete succeeds', async () => {
        const { cacheStore, sut } = makeSut();
        const purchases = mockPurchases();
        await sut.save(purchases);
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.insertCallsCount).toBe(1);
        expect(cacheStore.insertValues).toEqual(purchases);
    })

    test('Should throw if insert throws', async () => {
        const { cacheStore, sut } = makeSut();
        cacheStore.simulateInsertError();
        const promise = sut.save(mockPurchases());
        expect(promise).rejects.toThrow();
    })
})
