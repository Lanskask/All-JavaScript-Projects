
it('should show of angular binding', function() {
    expect(binding('qty * cost')).toEqual('$19.95');
    input('qty').enter('2');
    input('cost').enter('5.00');
    expect(binding('qty * cost')).toEqual('$10.00');
});
