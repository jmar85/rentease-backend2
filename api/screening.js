const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();
const supabase = createClient('https://zxhtdjdmphflrhksnbal.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4aHRkamRtcGhmbHJoa3NuYmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTEzNzksImV4cCI6MjA2NjkyNzM3OX0.MkoGaa9q_HTwNUMLCHaQKRm9oeHaBUFGQ1Z8rL6iSLw');
const screenTenant = (data) => {
  const { creditScore, income, rentalHistory } = data;
  const score = (creditScore * 0.5) + (income / 1000 * 0.3) + (rentalHistory * 0.2);
  return score >= 80 ? 'Low Risk' : score >= 50 ? 'Medium Risk' : 'High Risk';
};
router.post('/screening', async (req, res) => {
  try {
    const { name, email, creditScore, income, rentalHistory } = req.body;
    const riskLevel = screenTenant({ creditScore, income, rentalHistory });
    const { data, error } = await supabase
      .from('screenings')
      .insert([{ name, email, risk_level: riskLevel, created_at: new Date() }]);
    if (error) throw error;
    res.json({ riskLevel, screeningId: data[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to screen tenant' });
  }
});
module.exports = router;