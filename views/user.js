document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    try {
        const userResponse = await axios.get('http://localhost:4000/user/profile', {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const { user, recipes } = userResponse.data;
        document.getElementById('username').innerText = user.name;
        document.getElementById('emailId').innerText = user.email;

        const recipesContainer = document.getElementById('recipesContainer');

        recipes.forEach(recipe => {
            const base64Image = recipe.imgData ? `data:image/jpeg;base64,${arrayBufferToBase64(recipe.imgData.data)}` : 'default-image.jpg';
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';
            recipeCard.innerHTML = `
             <img src="${base64Image}" alt="${recipe.recipesName}" style="width: 200px; height:auto">
                <h3>${recipe.recipesName}</h3>
                <div class="buttons">
                    <button onclick="editRecipe(${recipe.id})">Edit</button>
                    <button class="delete-button" onclick="deleteRecipe(${recipe.id})">Delete</button>
                </div>
            `;
            recipesContainer.appendChild(recipeCard);
        });
    } catch (err) {
        console.error('Error fetching profile data:', err);
    }
});


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

async function editRecipe(recipeId) {
    localStorage.setItem('recipeIdToEdit', recipeId);
    window.location.href = './addReceipe.html';

}

async function deleteRecipe(recipeId) {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`http://localhost:4000/home/${recipeId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        document.location.reload();
    } catch (err) {
        console.error('Error deleting recipe:', err);
    }
}
async function loadFavorites(collectionName) {
    const token = localStorage.getItem('token');
    try {
        const favoritesResponse = await axios.get(`http://localhost:4000/user/${collectionName}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const favorites = favoritesResponse.data.favorites;
        const favoritesContainer = document.getElementById('favoritesContainer');
        favoritesContainer.innerHTML = '';

        favorites.forEach(favorite => {
            // Correct the use of the 'favorite' object
            const base64Image = favorite.Recipe.imgData ? `data:image/jpeg;base64,${arrayBufferToBase64(favorite.Recipe.imgData.data)}` : 'default-image.jpg';
            const favoriteCard = document.createElement('div');
            favoriteCard.className = 'favorite-card';
            favoriteCard.innerHTML = `
                <img src="${base64Image}" alt="${favorite.Recipe.recipesName}" style="width: 200px; height:auto">
                <h3>${favorite.Recipe.recipesName}</h3>
            `;
            favoritesContainer.appendChild(favoriteCard);
        });
    } catch (err) {
        console.error('Error fetching favorites:', err);
    }
}
