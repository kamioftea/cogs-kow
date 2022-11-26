module.exports = {
    open_graph: data => {
        const defaults = Object.fromEntries(
            [
                ['type', 'website'],
                [
                    'title',
                    [data.title, data.subtitle]
                        .filter(v => v != null)
                        .join(" - ") || 'Kings of War - Chesterfield Open Gaming Society'
                ],
                ['url', `https://kow.c-o-g-s.org.uk${data.page.url}`],
                ['image',`https://kow.c-o-g-s.org.uk/images/${data.image ?? 'cogs-og-image.png'}`],
                ['image:type', 'image/png'],
                ['image:alt', data.imageDescription ?? 'Chesterfield Open Gaming Society logo'],
            ]
                .filter(([, value]) => value != null)
        )

        return {
            ...defaults,
            ...(data.open_graph ?? {})
        }
    }
}
