import { CacheStore } from '@/data/protocols/cache';
import { LocalSavePurchases } from '@/data/usecases';

//sut = system under test

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0;
    insertCallsCount = 0;
    deletekey: string;
    insertKey: string;

    public delete(key: string): void {
        this.deleteCallsCount++;
        this.deletekey = key;
    }

    public insert(key: string): void {
        this.insertCallsCount++;
        this.insertKey = key;
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
        await sut.save();
        expect(cacheStore.deletekey).toBe('purchases');
        expect(cacheStore.deleteCallsCount).toBe(1);
    })

    test('Should not insert new Cache if delete fails', () => {
        const { cacheStore, sut } = makeSut();
        jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.save();
        expect(cacheStore.insertCallsCount).toBe(0);
        expect(promise).rejects.toThrow()
    })

    test('Should insert new Cache if delete succeds', async () => {
        const { cacheStore, sut } = makeSut();
        await sut.save();
        expect(cacheStore.deleteCallsCount).toBe(1);
        expect(cacheStore.insertCallsCount).toBe(1);
        expect(cacheStore.insertKey).toBe('purchases');
    })
})
