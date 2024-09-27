import React from 'react';

const Checkout = () => {
  return (
    <div>
      <h2>Checkout</h2>
      <p>Finalize sua compra preenchendo os dados abaixo.</p>
      {/* Simples formulário de exemplo */}
      <form>
        <div>
          <label>Nome:</label>
          <input type="text" />
        </div>
        <div>
          <label>Endereço:</label>
          <input type="text" />
        </div>
        <div>
          <label>Pagamento:</label>
          <select>
            <option value="credit">Cartão de Crédito</option>
            <option value="boleto">Boleto</option>
          </select>
        </div>
        <button type="submit">Confirmar Pedido</button>
      </form>
    </div>
  );
};

export default Checkout;
