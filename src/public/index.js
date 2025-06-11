document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('transactionForm');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      fromWalletId: document.getElementById('fromWalletId').value,
      toWalletId: document.getElementById('toWalletId').value,
      amount: parseFloat(document.getElementById('amount').value),
    };

    try {
      const response = await fetch(
        'https://bsxxc6vl7l.execute-api.us-east-1.amazonaws.com/dev/wallet/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Origin: window.location.origin,
          },
          mode: 'cors',
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        showMessage('Transação realizada com sucesso!', 'success');
        form.reset();
      } else {
        showMessage(
          data.message || 'Transação falhou. Por favor, tente novamente.',
          'error',
        );
      }
    } catch (error) {
      showMessage('Ocorreu um erro. Por favor, tente novamente.', 'error');
      console.error('Error:', error);
    }
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    // Clear message after 5 seconds
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 5000);
  }
});
