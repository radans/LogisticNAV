module.exports = (ref) => {

};

class Handler {
    constructor(base, current) {
        this.base = base;
        this.current = current;
    }
    get(key) {
        const value = this.current[key];
        if (Array.isArray(value)) {
            const copy = value.slice(0);
            this.current[key] = copy;
            return new Handler(this.base, copy);
        }
    }
    end() {
        return this.base;
    }
}
