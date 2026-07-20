import { useFusionContext } from 'fusion:context';
import { isServerSide } from 'fusion:environment';
import { LazyLoad, usePhrases } from '@wpmedia/arc-themes-components';
import TickarooLiveblog from './_children/TickarooLiveblog';
import PropTypes from 'fusion:prop-types';

const BLOCK_CLASS_NAME = 'b-article-body';

function parseArticleItem(item, index, arcSite, phrases, id, customFields) {
    const { _id: key = index, type, content } = item;
    const {
      hideImageTitle = false,
      hideImageCaption = false,
      hideImageCredits = false,
      hideGalleryTitle = false,
      hideGalleryCaption = false,
      hideGalleryCredits = false,
      hideVideoTitle = false,
      hideVideoCaption = false,
      hideVideoCredits = false,
      viewportPercentage = 65,
      borderRadius = false,
      aspectRatio,
    } = customFields;
    switch (type) {
        case 'custom_embed':
            switch (item.subtype) {
                case 'Tickaroo Liveblog':
                    return <TickarooLiveblog key={`${type}_${index}_${key}`} embed={item.embed} />;
                default:
                    return null;
            }
        default:
            return null;
    }
}

export const ArticleBodyChainPresentation = ({
    children,
    customFields = {},
    context,
  }) => {
    const { globalContent: items = {}, arcSite, id } = context;
  
    const { content_elements: contentElements = [], copyright, location } = items;
    const { elementPlacement: adPlacementConfigObj = {} } = customFields;
    const phrases = usePhrases();
  
    const adPlacements = Object.keys(adPlacementConfigObj).map((key) => ({
      feature: +key,
      paragraph: +adPlacementConfigObj[key],
    }));
  
    const paragraphTotal = contentElements.filter(
      (element) => element.type === 'text'
    ).length;
  
    let paragraphCounter = 0;
    const articleBody = [
      ...contentElements.map((contentElement, index) => {
        if (contentElement.type === 'text') {
          // Start at 1 since the ad configs use one-based array indexes
          paragraphCounter += 1;
  
          const adsAfterParagraph = adPlacements.filter(
            (placement) => placement.paragraph === paragraphCounter
          );
  
          if (
            paragraphCounter === 1 &&
            location &&
            contentElement.content.indexOf(`${location} &mdash;`) !== 0
          ) {
            // eslint-disable-next-line no-param-reassign
            contentElement.content = `${location} &mdash; ${contentElement.content}`;
          }
  
          // The ad features should follow the content element if they exist, but not if
          // the current paragraph is the last or second-to-last paragraph.
          if (adsAfterParagraph.length && paragraphCounter < paragraphTotal - 1) {
            return [
              parseArticleItem(
                contentElement,
                index,
                arcSite,
                phrases,
                id,
                customFields
              ),
              ...adsAfterParagraph.map(
                (placement) => children[placement.feature - 1]
              ),
            ];
          }
        }
  
        return parseArticleItem(
          contentElement,
          index,
          arcSite,
          phrases,
          id,
          customFields
        );
      }),
      ...(copyright
        ? [
            parseArticleItem(
              {
                type: 'copyright',
                content: copyright,
              },
              'copyright-text',
              arcSite,
              null, // phrases not used by text type
              null, // id not used by text type
              {} // customFields only used in video
            ),
          ]
        : []),
    ];
  
    return <article className={BLOCK_CLASS_NAME}>{articleBody}</article>;
  };
  
  const ArticleBodyChain = ({ children, customFields = {} }) => {
    const context = useFusionContext();
    const { isAdmin } = context;
    if (customFields?.lazyLoad && isServerSide() && !isAdmin) {
      // On Server
      return null;
    }
    return (
      <LazyLoad enabled={customFields?.lazyLoad && !isAdmin}>
        <ArticleBodyChainPresentation
          context={context}
          customFields={customFields}
        >
          {children}
        </ArticleBodyChainPresentation>
      </LazyLoad>
    );
  };
  
  ArticleBodyChain.propTypes = {
    customFields: PropTypes.shape({
      elementPlacement: PropTypes.kvp.tag({
        label: 'Ad placements',
        group: 'Inline ads',
        description:
          'Places your inline article body ads in the article body chain. For each ad feature in the chain, fill in two values below: Field 1) The position of the ad within the chain and Field 2) the paragraph number that this ad should follow in the article body. For example, entering 1 and 3 would mean that the first ad in the article body chain will be placed after the third paragraph in the article.',
      }),
      lazyLoad: PropTypes.bool.tag({
        name: 'Lazy Load block?',
        defaultValue: false,
        description:
          'Turning on lazy-loading will prevent this block from being loaded on the page until it is nearly in-view for the user.',
      }),
      hideImageTitle: PropTypes.bool.tag({
        description:
          'This display option applies to all Images in the Article Body.',
        label: 'Hide Title',
        defaultValue: false,
        group: 'Image Display Options',
      }),
      hideImageCaption: PropTypes.bool.tag({
        description:
          'This display option applies to all Images in the Article Body.',
        label: 'Hide Caption',
        defaultValue: false,
        group: 'Image Display Options',
      }),
      hideImageCredits: PropTypes.bool.tag({
        description:
          'This display option applies to all Images in the Article Body.',
        label: 'Hide Credits',
        defaultValue: false,
        group: 'Image Display Options',
      }),
      hideGalleryTitle: PropTypes.bool.tag({
        description:
          'This display option applies to all Galleries in the Article Body',
        label: 'Hide Title',
        defaultValue: false,
        group: 'Gallery Display Options',
      }),
      hideGalleryCaption: PropTypes.bool.tag({
        description:
          'This display option applies to all Galleries in the Article Body',
        label: 'Hide Caption',
        defaultValue: false,
        group: 'Gallery Display Options',
      }),
      hideGalleryCredits: PropTypes.bool.tag({
        description:
          'This display option applies to all Galleries in the Article Body',
        label: 'Hide Credits',
        defaultValue: false,
        group: 'Gallery Display Options',
      }),
      aspectRatio: PropTypes.oneOf([
        '--',
        '16:9',
        '9:16',
        '1:1',
        '4:3',
      ]).isRequired.tag({
        description:
          'Aspect ratio to use in player (Defaults to the aspect ratio of the resolved video)',
        label: 'Player aspect ratio',
        defaultValue: '--',
        group: 'Video Display Options',
        labels: {
          '--': 'Video Source',
          '16:9': '16:9',
          '9:16': '9:16',
          '1:1': '1:1',
          '4:3': '4:3',
        },
      }),
      viewportPercentage: PropTypes.number.tag({
        description:
          'Height percentage the player takes from viewport (Applies only for 9:16 videos)',
        label: 'View height percentage',
        defaultValue: 65,
        group: 'Video Display Options',
      }),
      borderRadius: PropTypes.bool.tag({
        description: 'Applies only for 9:16 videos',
        label: 'Round player corners',
        defaultValue: false,
        group: 'Video Display Options',
      }),
      hideVideoTitle: PropTypes.bool.tag({
        description:
          'This display option applies to all Videos in the Article Body',
        label: 'Hide Title',
        defaultValue: false,
        group: 'Video Display Options',
      }),
      hideVideoCaption: PropTypes.bool.tag({
        description:
          'This display option applies to all Videos in the Article Body',
        label: 'Hide Caption',
        defaultValue: false,
        group: 'Video Display Options',
      }),
      hideVideoCredits: PropTypes.bool.tag({
        description:
          'This display option applies to all Videos in the Article Body',
        label: 'Hide Credits',
        defaultValue: false,
        group: 'Video Display Options',
      }),
    }),
  };
  
  ArticleBodyChain.label = 'Article Body – Custom Block';
  
  ArticleBodyChain.icon = 'arc-article';
  
  export default ArticleBodyChain;