To make the `when` indent 8 spaces instead of 2 spaces, you can simply change the _indent/erlang.vim_.

e.g.
In vim82, edit the function "ErlangIndent" (specified by indentexpr),

Change

```vim
if currline =~# '^\s*when\>'
    let new_col += 2
endif
```

to

```vim
if currline =~# '^\s*when\>'
    let new_col += 8
endif
```

