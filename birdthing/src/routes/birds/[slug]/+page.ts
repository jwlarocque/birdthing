export function load ({params}) {
    console.log(params);
    const slug = params.slug;
    console.log(slug);
    
    return {
        slug
    };
}