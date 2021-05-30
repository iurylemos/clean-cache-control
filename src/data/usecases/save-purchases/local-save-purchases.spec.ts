import { mockPurchases, CacheStoreSpy } from '@/data/tests';
import { LocalSavePurchases } from '@/data/usecases';

//sut = system under test

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
