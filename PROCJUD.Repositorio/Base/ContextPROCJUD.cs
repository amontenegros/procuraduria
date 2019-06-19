using PROCJUD.IRepositorio.Base;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PROCJUD.Repositorio.Base
{
    public class ContextPROCJUD : IContext, IUnitOfWork, IDisposable
    {
        private readonly DbContext _dataContext;

        public ContextPROCJUD(DbContext context)
        {
            _dataContext = context;
        }
        public DbContext GetContext()
        {
            return _dataContext;
        }

        public IQueryable<T> Listar<T>(System.Linq.Expressions.Expression<Func<T, bool>> filter = null, int pageIndex = 1, int pageSize = int.MaxValue) where T : class
        {
            IQueryable<T> query = _dataContext.Set<T>();

            if (filter != null)
                query = query.Where(filter).OrderBy(i => (string)null).Skip((pageIndex - 1) * pageSize).Take(pageSize);

            return query;
        }

        public int Contar<T>(System.Linq.Expressions.Expression<Func<T, bool>> filter = null) where T : class
        {
            IQueryable<T> query = _dataContext.Set<T>();
            if (filter != null)
                return query.Where(filter).Count();
            return query.Count();
        }

        public T ListarUno<T>(System.Linq.Expressions.Expression<Func<T, bool>> predicate) where T : class
        {
            return _dataContext.Set<T>().SingleOrDefault(predicate);
        }

        public void Insertar<T>(T entity) where T : class
        {
            _dataContext.Set<T>().Add(entity);
        }

        public void Actualizar<T>(T entity) where T : class
        {
            DbEntityEntry entityEntry = _dataContext.Entry(entity);
            if (entityEntry.State == EntityState.Detached)
            {
                _dataContext.Set<T>().Attach(entity);
                entityEntry.State = EntityState.Modified;
            }
        }

        public void ActualizarParcial<T>(T entity, params string[] noChangedPropertyNames) where T : class
        {
            DbEntityEntry entityEntry = _dataContext.Entry(entity);
            if (entityEntry.State == EntityState.Detached)
            {
                _dataContext.Set<T>().Attach(entity);
                entityEntry.State = EntityState.Modified;
                foreach (var propertyName in noChangedPropertyNames)
                {
                    _dataContext.Entry(entity).Property(propertyName).IsModified = false;
                }
            }
        }

        public void Eliminar<T>(T entity) where T : class
        {
            DbEntityEntry entityEntry = _dataContext.Entry(entity);
            if (entityEntry.State == EntityState.Detached)
                _dataContext.Set<T>().Attach(entity);

            entityEntry.State = EntityState.Deleted;
            _dataContext.Set<T>().Remove(entity);
        }

        public int Guardar(bool validate = true)
        {
            if (!validate)
            {
                _dataContext.Configuration.ValidateOnSaveEnabled = false;
            }
            try
            {
                return _dataContext.SaveChanges();
            }
            catch (DbEntityValidationException ex)
            {
                throw ex;
            }
        }

        #region IDisposable
        private bool _disposed;

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
            {
                return;
            }

            if (disposing)
            {
                if (_dataContext != null)
                {
                    _dataContext.Dispose();
                }
            }

            _disposed = true;
        }
        #endregion
    }
}
