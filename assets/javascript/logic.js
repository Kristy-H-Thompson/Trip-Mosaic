/* 
------------------------------------------------------------------------------------------------------------

Makes the nav bar responsive with a hamburger menu

------------------------------------------------------------------------------------------------------------ 
*/

    // Define some constants
      const menuButton = document.getElementById('menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
    
    // When hamburger menu icon is clicked, toggle the nav box
      menuButton.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
      });
