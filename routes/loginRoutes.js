app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) 
	 return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
	  return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id },
	  process.env.JWT_SECRET);
    res.json({ token });
});
