import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import textContrastClass from 'flarum/common/helpers/textContrastClass';

export const extenders = [];

app.initializers.add('resofire-terminal', () => {

    // ── Discussion list: tag-colour accent stripe ─────────────
    // Sets --aurora-tag-color on each row so the LESS ::before stripe works
    extend(DiscussionListItem.prototype, 'elementAttrs', function (attrs) {
        const tags = this.attrs.discussion.tags?.();
        const color = tags && tags.length ? tags[0].color() : null;
        if (!attrs.style) attrs.style = {};
        attrs.style['--aurora-tag-color'] = color || 'var(--primary-color)';
    });

    // ── Sidebar: replace flat tag list with coloured tiles ────
    extend(IndexSidebar.prototype, 'navItems', function (items) {
        // Remove individual tag items added by flarum/tags
        const keys = Object.keys(items.toObject());
        keys.forEach((key) => {
            if ((key.startsWith('tag') && key !== 'tags') || key === 'separator' || key === 'moreTags') {
                items.remove(key);
            }
        });

        const allTags = app.store.all('tags');
        const primaryTags = allTags
            .filter((t) => t.position() !== null && !t.isChild())
            .sort((a, b) => (a.position() ?? 0) - (b.position() ?? 0));

        if (!primaryTags.length) return;

        const params = app.search.state.stickyParams();
        const currentTag = app.currentTag?.();

        const tiles = primaryTags.map((tag) => {
            const color = tag.color() || '#888';
            const icon = tag.icon();
            const isActive = currentTag === tag;

            return (
                <a
                    href={app.route('tag', { ...params, tags: tag.slug() })}
                    className={'aurora-tag-tile' + (isActive ? ' active' : '')}
                    style={{ '--tile-color': color }}
                    onclick={(e) => {
                        e.preventDefault();
                        m.route.set(app.route('tag', { ...params, tags: tag.slug() }));
                    }}
                >
                    {icon && <i className={'aurora-tag-tile-icon ' + icon} />}
                    <span className="aurora-tag-tile-name">{tag.name()}</span>
                    <span className="aurora-tag-tile-count">{tag.discussionCount()}</span>
                </a>
            );
        });

        items.add(
            'tagTiles',
            <div className="aurora-tag-grid">{tiles}</div>,
            -14
        );
    });

});
