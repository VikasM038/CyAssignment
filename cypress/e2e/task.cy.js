describe('Place an order Functinality', () => {
  before(() => {
    cy.visit('https://php811.funnelkitdemos.com/')
  });

  
  it('should show order id once the checkout process complete successfully', () => {
      // Open the URL
      // Click on Add to cart button of a product
      cy.get('.button.product_type_simple.add_to_cart_button.ajax_add_to_cart').first().click()
  
      // Wait for side cart to auto-open after product is added
      cy.get('#fkcart-checkout-button').should('be.visible')
  
      // Click on the 'Add to Cart' button at the bottom if present
      cy.get('.fkcart-add-product-button.fkcart-button').first().click()
      
      cy.get('#fkcart-checkout-button').dblclick()
  

      // Validate redirection to checkout page
      cy.url().should('include', '/checkout')
  
      // Fill in random data and choose 'Cash on delivery' payment method
      cy.get('#billing_email').type('test@test.com')
      cy.get('#billing_first_name').type('Test')
      cy.get('#billing_last_name').type('Automation')
      cy.get('#shipping_address_1').type('123 Main St')
      cy.get('#shipping_city').type('Mumbai')
      cy.get('#shipping_postcode').type('400001')
   

      cy.get('#pushengage-opt-in-1-close').click()
      cy.wait(2000)
      cy.get('#shipping_country').select('IN', {force:true})
      cy.get('#shipping_country').should('have.value', 'IN')
      cy.get('#shipping_state').select('MH', {force:true})
      cy.get('#shipping_state').should('have.value', 'MH')
      cy.get('#billing_phone').type('1234567890')
  
      
      cy.wait(1000)
 
      // Handle offer if present
      // cy.get('.wfob_checkbox.wfob_bump_product.wfob_bump_product').check()
      cy.get('.wfob_checkbox.wfob_bump_product.wfob_bump_product').then(offerCheckBox => {
        if (offerCheckBox.length > 0) {
          cy.get('.wfob_checkbox.wfob_bump_product.wfob_bump_product').check()
        }
      })

      cy.wait(2000)
       
      // click on place order button
      cy.get('.wfacp-order-place-btn-wrap #place_order').click()

      cy.on('window:alert', (message) => {
        // Check if the message contains 'Save'
        if (message.includes('Save')) {

          cy.log('Save button clicked');
        } else {
          cy.log('No Thanks button clicked');
        }
      });
 
 
      cy.get('.elementor-button.elementor-button-link.wfocu_upsell').click()
      cy.wait(5000)

      cy.xpath('//div[@class="elementor-widget-container" and contains(text(), "Order #")]').invoke('text')
      .then((text) => {
        expect(text).to.include('Order #')
       const orderIdText = text.split('#')
       let id = parseInt(orderIdText[orderIdText.length-1])
        cy.log(`Order id is ${id} and the datatype is ${typeof(id)}`)
        expect(typeof(id)).to.equal('number') 
        expect(id).to.be.within(1, 100000)    
      })
       // Validate redirection to thank you page
       cy.url().should('include', '/order-confirmed')
    })
  })