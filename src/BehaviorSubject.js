export class BehaviorSubject {
    constructor(initData) {
        this.data = initData;
        this.observers = [];
    }
    subscribe(observer) {
        this.observers.push(observer);
        return {
            unsubscribe: () => {
                this.observers = this.observers.filter((item) => item !== observer);
            },
        };
    }
    next(nextData) {
        this.observers.forEach((itemObserver) => {
            itemObserver(nextData);
        });
    }
}