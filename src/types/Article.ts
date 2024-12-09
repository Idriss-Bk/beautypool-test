// fetchArticle.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const DIRECTUS_URL = 'https://your-directus-instance.com/items/articles';

export async function fetchArticleBySlug(slug: string) {
  const accessToken = Cookies.get('access_token'); // Retrieve the access token from cookies
  try {
    const response = await axios.get(DIRECTUS_URL, {
      params: {
        filter: {
          slug: {
            _eq: slug,
          },
        },
        fields: '*.*', // Fetch all fields
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data && response.data.data.length > 0) {
      return response.data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}
