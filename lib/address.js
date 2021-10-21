// Parses input string into address components.
// Used for highlighting certain parts of the
// onloading and unloading addresses.

exports.parse = (string) => {
    const context = new Context();
    const tokens = [];
    let text = '';    
    let i = 0;
    while (i < string.length) {
        const match = context.match(i, string);
        if (match) {
            if (text.length > 0) {
                tokens.push(text);
                text = '';
            }
            tokens.push(match);
            i += match.text.length;
        }
        text += string.charAt(i);
        i += 1;
    }
    if (text.length > 0) {
        tokens.push(text);
    }
    return tokens;
};

// Context is a set of regular expressions.

class Context {

    constructor() {
        this.matchers = [
            new Matcher(/\-?\d+\.\d+,\s+\-?\d+\.\d+/y, 'location'),
            new Matcher(/\([^\)]{5,}\)/y, 'time')
        ];
    }

    match(index, string) {
        for (const matcher of this.matchers) {
            const match = matcher.match(index, string);
            if (match) {
                return match;
            }
        }
        return null;
    }
}

class Matcher {

    constructor(regex, name) {
        this.regex = regex;
        this.name = name;
    }

    match(index, string) {
        this.regex.lastIndex = index;
        const match = string.match(this.regex);
        if (match) {
            return { name: this.name, text: match[0] };
        }
    }
}
