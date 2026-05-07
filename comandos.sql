create table Cliente (
	id serial primary key,
	nome varchar(100) not null, 
	email varchar(100),
	genero varchar(1) not null,
	DataNascimento date not null
)
------------------- Inseri dados na tabela cliente -------------------------

insert into cliente (nome,email,genero,datanascimento)
values ('Sara','sara@sara.com','F','1997-06-04')

------------------ Seleciona todos dados de uma tabela ---------------------

select * from cliente 

------------------ Seleciona dados especificos de uma tabela ---------------------

select nome,datanascimento from cliente

------------------- Inseri dados na tabela cliente (SEM EMAIL) -------------------------

insert into cliente (nome,genero,datanascimento)
values ('Sofia','F','1990-01-03')

-------------------------- Atualiza tabelas -------------------------------------
update cliente set email = 'sofia@sofia.com' where id=2