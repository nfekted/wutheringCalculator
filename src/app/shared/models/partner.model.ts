export class Partner {

    image: string;
    name: string;

    links: Array<Array<string>>;

    constructor(name: string, image: string, links: Array<Array<string>>) {
        this.name = name;
        this.image = image;
        this.links = links
    }
}