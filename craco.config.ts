import path from 'path';

const resolvePath = (p: any) => path.resolve(__dirname, p);

module.exports = {
    webpack: {
        alias: {
            '@': resolvePath('src')
        }
    }
};
